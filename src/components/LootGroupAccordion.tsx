import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Fab,
    Box,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Select,
    MenuItem,
    Radio,
    ToggleButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HexColor, LootGroup } from '../templating/filterscape';
import { DeleteForever } from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
interface LootGroupAccordionProps {
    groups: LootGroup[];
    setGroups: Dispatch<SetStateAction<LootGroup[]>>
}

interface CreateLootGroupDialogProps {
    open: boolean;
    onClose: () => void;
    setGroups: Dispatch<SetStateAction<LootGroup[]>>
}

const ColorSwatch = ({ color, onChange }: { color?: HexColor, onChange?: (color: HexColor) => void }) => (
    <Box
        component="span"
        sx={{
            display: 'inline-block',
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: color,
            border: '1px solid rgba(0, 0, 0, 0.23)',
            marginRight: 1,
            verticalAlign: 'middle'
        }}

    >
        {/* total hack to get a circle that adopts the chosen color */}
        {onChange ?
            <input
                type="color"
                value={color || '#00000000'}
                onChange={(e) => onChange(e.target.value as HexColor)}
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'block',
                    opacity: 0
                }}
            /> : null}
    </Box>
);

const ColorButton = ({ color, onChange, label }: { color?: HexColor; onChange: (color: HexColor) => void; label: string }) => (
    <Box sx={{ position: 'relative' }}>

        <ColorSwatch onChange={onChange} color={color} />
        <Typography component="span">
            {label}
        </Typography>
    </Box>
);

const CreateLootGroupDialog: React.FC<CreateLootGroupDialogProps> = ({ open, onClose, setGroups }) => {
    const [name, setName] = useState<string | null>(null);
    const [foregroundColor, setForegroundColor] = useState<HexColor>('#ffffff');
    const [backgroundColor, setBackgroundColor] = useState<HexColor>('#000000');
    const [borderColor, setBorderColor] = useState<HexColor>('#ffffff');
    const [beam, setBeam] = useState<boolean>(true);

    const create = () => {
        setGroups((prevGroups: LootGroup[]) => {
            const group = {
                name: name as string,
                foregroundColor,
                backgroundColor,
                borderColor,
                beam,
                valueThreshold: 10_000_000
            }
            return [...(prevGroups || []), group]
        })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Loot Group</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Configure a new loot group to add to your filter.
                </DialogContentText>
                <TextField
                    slotProps={{ htmlInput: { 'data-op-ignore': 'true' } }}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Group Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                    helperText={name ? null : 'Group name is required'}
                    error={!name}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <ColorButton
                        color={foregroundColor}
                        onChange={setForegroundColor}
                        label="Foreground Color"
                    />
                    <ColorButton
                        color={backgroundColor}
                        onChange={setBackgroundColor}
                        label="Background Color"
                    />
                    <ColorButton
                        color={borderColor}
                        onChange={setBorderColor}
                        label="Border Color"
                    />
                    <ToggleButton
                        value="check"
                        selected={beam}
                        onChange={() => setBeam((prevSelected) => !prevSelected)}
                    >
                        <AutoAwesomeIcon />
                    </ToggleButton>
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button disabled={!name} onClick={create}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export const LootGroupAccordion: React.FC<LootGroupAccordionProps> = ({
    groups,
    setGroups
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography>Loot Groups</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Button
                        variant="contained"
                        onClick={() => setOpen(true)}
                        sx={{ mb: 2 }}
                    >
                        Add Loot Group
                    </Button>
                    {open ?
                        <CreateLootGroupDialog
                            open={open}
                            onClose={() => setOpen(false)}
                            setGroups={setGroups}
                        /> : null}
                    {groups?.map((group, index) => (
                        <Card
                            key={index}
                            variant='outlined'
                        >
                            <CardHeader title={
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                    <Typography>{group.name}</Typography>
                                    <Typography>Foreground</Typography>
                                    <ColorSwatch color={group.foregroundColor} />
                                    <Typography>Background</Typography>
                                    <ColorSwatch color={group.backgroundColor} />
                                    <Typography>Border</Typography>
                                    <ColorSwatch color={group.borderColor} />
                                    <Typography>Beam:</Typography>
                                    {group.beam ? <AutoAwesomeIcon /> : <NotInterestedIcon />}
                                    
                                    <Typography>Value Tier:</Typography>
                                    <Typography>{group.valueThreshold.toLocaleString()}</Typography>
                                    <IconButton
                                        sx={{ marginLeft: 'auto' }}
                                        onClick={() => {
                                            setGroups(groups?.filter((_, i) => i !== index))
                                        }}
                                    >
                                        <DeleteForever />
                                    </IconButton>
                                </Box>
                            } />
                        </Card>
                    ))}

                </AccordionDetails>
            </Accordion>
        </div >
    );
};
