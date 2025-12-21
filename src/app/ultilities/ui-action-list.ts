export interface IUiActionList<TList>
{
    onAdd() : void;
    onUpdate(item : TList) : void;
    onDelete(item : TList) : void;
    onViewDetail(item : TList) : void;
    onSearch() : void;
    onResetSearch() : void;
}