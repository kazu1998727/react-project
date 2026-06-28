import Button from "../ui/Button";
import TextArea from "../ui/TextArea";

type Props = {
  value: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  error?: string;
};

export default function EditableBody({
  value,
  isEditing,
  onStartEdit,
  onChange,
  onSave,
  onCancel,
  error,
}: Props) {
  return (
    <div className="flex flex-1 min-h-0 items-start justify-between gap-5 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 gap-1 h-full">
        {isEditing ? (
          <TextArea
            value={value}
            onChange={onChange}
            autoFocus
            className=" min-h-0 rounded-[8px] p-[30px] bg-white overflow-y-auto"
            error={error}
          />
        ) : (
          <div className="flex-1 min-h-0 rounded-[8px] p-[30px] bg-white overflow-y-auto">
            <p className="m-0 leading-normal whitespace-pre-line text-body">
              {value}
            </p>
          </div>
        )}
      </div>
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
