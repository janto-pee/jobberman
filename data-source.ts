import { AppDataSource as AppDataSourceLocal } from "./data-source-local";
import { AppDataSourceProd } from "./data-source-prod";

// function DataSource() {

// }
let AppDataSource = AppDataSourceLocal;
process.env.NODE_ENV === "production"
  ? (AppDataSource = AppDataSourceProd)
  : (AppDataSource = AppDataSourceLocal);
export default AppDataSource;
