import { Alert, AlertColor, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUiStore } from "../store/store";
import { parseComponent } from "../utils/link";
import { loadFilter } from "../utils/modularFilterLoader";

export const ImportPage = () => {
  const { importData } = useParams();
  const navigate = useNavigate();
  const addImportedModularFilter = useUiStore(
    (state) => state.addImportedModularFilter
  );
  const setActiveFilterId = useUiStore((state) => state.setActiveFilterId);
  const [alerts, setAlerts] = useState<{ text: string; severity: string }[]>(
    []
  );

  useEffect(() => {
    if (importData) {
      try {
        const { filterSource, config } = parseComponent(importData);
        loadFilter(filterSource)
          .then((filter) => {
            addImportedModularFilter(filter);
            setActiveFilterId(filter.id);
            setAlerts([
              {
                text: "Filter imported successfully",
                severity: "success",
              },
            ]);
            // Redirect to home page after successful import
            setTimeout(() => {
              navigate("/");
            }, 2000);
          })
          .catch((error) => {
            setAlerts([
              {
                text: `Failed to import filter: ${error}`,
                severity: "error",
              },
            ]);
          });
      } catch (error) {
        console.error(error, importData);
        setAlerts([
          {
            text: `Failed to parse import link: ${error}`,
            severity: "error",
          },
        ]);
      }
    }
  }, [importData, addImportedModularFilter, setActiveFilterId, navigate]);

  return (
    <Container>
      {alerts.map((alert) => (
        <Alert key={alert.text} severity={alert.severity as AlertColor}>
          {alert.text}
        </Alert>
      ))}
    </Container>
  );
};
