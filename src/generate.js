import { basename, dirname, join } from 'path';
import { statSync, readFileSync } from 'fs';

function generate(program, { cwd }) {
    console.log(program.css);
    console.log(program.base);
    console.log(program.a);
    console.log(program.args);
    const [type, name] = program.args;
    console.log(type, name);
    console.log(cwd);
}

export default generate;