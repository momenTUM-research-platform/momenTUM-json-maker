import { Download } from "../../../src/renderers/actions/Download";
import { render, userEvent, fireEvent, waitFor, getByRole, findByText } from "../../setup";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { download } from "../../../src/services/actions";
import { deconstructStudy } from "../../../src/utils/deconstruct";
import { useStore } from "../../../src/State";
import { Commit } from "../../../src/renderers/actions/Commit";
import { debug } from "console";

describe("Commit testing", () => {
  it("renders correctly", () => {
    const mockOnClick = vi.fn();
    const mockTimestamp = new Date().getTime();
    const mockHash = "abc123";

    const { getByText } = render(
      <Commit onClick={mockOnClick} timestamp={mockTimestamp} hash={mockHash} />
    );

    expect(getByText("abc123")).toBeInTheDocument();
    expect(getByText("a few seconds ago")).toBeInTheDocument();
  });
  it("calls onClick when button is clicked", () => {
    const mockOnClick = vi.fn();

    const hash = "1234567890";
    const timestamp = Date.now() - 1000;

    const { getByRole } = render(
      <Commit onClick={mockOnClick} hash={hash} timestamp={timestamp} />
    );

    fireEvent.click(getByRole("button"));

    expect(mockOnClick).toHaveBeenCalled();
  });
});
