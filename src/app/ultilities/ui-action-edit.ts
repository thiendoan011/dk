export interface IUiActionEdit<TList>
{
    onAdd() : void;
    onUpdate(item : TList) : void;
    onApprove(item : TList) : void;
    onSave() : void;
}