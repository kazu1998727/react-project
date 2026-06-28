import Button from "../ui/Button";
import Input from "../ui/Input";

type Props = {
  value: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  error?: string;
};

export default function EditableTitle({
  value,
  isEditing,
  onStartEdit,
  onChange,
  onSave,
  onCancel,
  error,
}: Props) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-5">
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-1">
          <Input value={value} onChange={onChange} autoFocus error={error} />
          {error && (
            <p className="text-caption leading-none text-red-500 pl-1">
              {error}
            </p>
          )}
        </div>
      ) : (
        <h1 className="text-heading shrink-0 pl-[30px]">{value}</h1>
      )}
      {isEditing ? (
        <div className="flex shrink-0 gap-2.5">
          <Button
            icon="cancel"
            label="Cancel"
            size="s"
            variant="muted"
            onClick={onCancel}
          />
          <Button icon="save" label="Save" size="s" onClick={onSave} />
        </div>
      ) : (
        <Button icon="edit" label="Edit" size="m" onClick={onStartEdit} />
      )}
    </div>
  );
}
