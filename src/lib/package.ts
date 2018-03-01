import * as fs from "fs";
import * as path from "path";

const packageRoute : string = path.resolve("./package.json");

// Loading package file
export const packageData : any = JSON.parse(fs.readFileSync(packageRoute).toString());