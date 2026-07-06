export interface IRepository<TDomain, TCreateInput> {
    create(input: TCreateInput): Promise<TDomain>;
    findAll(): Promise<TDomain[]>;
    findById(id: number): Promise<TDomain | null>;
}
