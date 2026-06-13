import * as fs from "fs";
import { Exportador } from "../interfaces/Exportador";

export class ExportadorCSV implements Exportador {

    public exportar(conteudo: string): void {

        fs.writeFileSync(
            "relatorio.csv",
            conteudo,
            "utf-8"
        );

        console.log(
            "Arquivo CSV gerado com sucesso."
        );
    }
}