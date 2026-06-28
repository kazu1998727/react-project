import { render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("error が未指定のとき border-red-500 クラスが付かない", () => {
    render(<Input value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveClass("border-red-500");
  });

  it("error を渡すと border-red-500 クラスが付く", () => {
    render(
      <Input value="" onChange={() => {}} error="タイトルを入力してください" />,
    );
    expect(screen.getByRole("textbox")).toHaveClass("border-red-500");
  });
});
