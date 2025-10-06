import { Command } from 'commander';
import fs from 'fs';

const program = new Command();

program
  .requiredOption('-i, --input <path>', 'Path to input JSON file')  
  .option('-o, --output <path>', 'Path to output file')             
  .option('-d, --display', 'Display result in console')             
  .option('-s, --survived', 'Show only passengers who survived')  
  .option('-a, --age', 'Display age of passengers');         

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

const rawData = fs.readFileSync(options.input, 'utf-8');
let data = JSON.parse(rawData);

if (options.survived) {
  data = data.filter(item => Number(item.Survived) === 1);
}

let result = data.map(item => {
  const name = item.Name || "Unknown";
  const age = options.age ? (item.Age ?? "N/A") : "";
  const ticket = item.Ticket || "NoTicket";
  return options.age ? `${name} ${age} ${ticket}` : `${name} ${ticket}`;
}).join('\n');

if (options.display) {
  console.log(result);
}

if (options.output) {
  fs.writeFileSync(options.output, result, 'utf-8');
}
