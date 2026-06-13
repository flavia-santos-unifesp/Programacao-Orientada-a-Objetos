import { Exportador } from "../interfaces/Exportador";

export class ExportadorPDF implements Exportador {

    public exportar(conteudo: string): void {
        console.log("Exportacao PDF simulada com sucessso");
    }

}