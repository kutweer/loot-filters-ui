declare module "*/build-info.json" {
  interface BuildInfo {
    gitSha: string;
  }
  const value: BuildInfo;
  export = value;
}
