import { Venda } from "../models/Venda";
import { VendaRepository } from "../repositories/VendaRepository";

export class VendaService {

    constructor(
        private vendaRepository: VendaRepository
    ) {}

    public registrarVenda(venda: Venda): void {

        for (const itemVenda of venda.getItens()) {

            const item = itemVenda.getItem();

            if ("reduzirEstoque" in item) {

                item.reduzirEstoque(
                    itemVenda.getQuantidade()
                );
            }
        }

         this.vendaRepository.salvar(venda);
}
}