
import { describe, expect, it, vi } from "vitest";
import { Download } from "../../../src/renderers/actions/Download";
import { render, screen, act, fireEvent } from "@testing-library/react";


// Create a spy for the download function
vi.mock("/services/actions", () => ({
  download: vi.fn().mockImplementation((studyId: any) => {
    console.log("Download is actually being called here");
    return JSON.parse('{ some: "data" }');
  }),
}));

vi.mock("../../../src/utils/deconstruct", () => ({
  deconstructStudy: vi.fn(),
}));

describe("Download function testing", () => {
  const close = vi.fn();

  it("renders the first step of the download process", async () => {
    await act(async () => {
      render(<Download close={close} />);
    });

    expect(
      screen.getByLabelText("Study ID", { selector: "input" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You can download a study by entering its ID or permalink."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("navigates through the download process steps", async () => {
    const studyId = "some_study_id";
    const study = { id: studyId };
    const atoms = { some: "atom" };
    const deconstructedStudy = { some: "data" };

    await act(async () => {
      render(<Download close={close} />);
    });

    const textField = screen.getByLabelText("Study ID");

    fireEvent.change(textField, { target: { value: "random_id" } });

    expect(textField.value).toBe("random_id");

    // Go to the second step
    fireEvent.click(screen.getByText("Next"));

    expect(
      await screen.findByText("Fetching the study from the server...")
    ).toBeInTheDocument();

    // Continue with the rest of the test
  });
});
