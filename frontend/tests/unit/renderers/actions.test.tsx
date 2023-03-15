import { Download } from "../../../src/renderers/actions/Download";
import { render, userEvent, fireEvent, waitFor, getByRole, findByText } from "../../setup";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { download, validateStudy } from "../../../src/services/actions";
import { deconstructStudy } from "../../../src/utils/deconstruct";
import { useStore } from "../../../src/state";
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

vi.mock("../../../src/services/actions");
vi.mock("../../../src/utils/deconstruct");

describe("Download function testing", () => {
  const close = vi.fn();

  it("renders the first step of the download process", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <Download close={close} />
    );
    expect(
      getByLabelText("Study ID", { selector: "input" })
    ).toBeInTheDocument();
    expect(
      getByText("You can download a study by entering its ID or permalink.")
    ).toBeInTheDocument();
    expect(getByText("Next")).toBeInTheDocument();
  });

  // it("navigates through the download process steps", async () => {
  //   const studyId = "some_study_id";
  //   const study = { id: studyId };
  //   const atoms = { some: "atom" };
  //   const deconstructedStudy = { some: "data" };
  //   const { getByLabelText, getByText, queryByText } = render(
  //     <Download close={close} />
  //   );

  //   download.mockResolvedValue(study);
  //   deconstructStudy.mockReturnValue(deconstructedStudy);


  //   // Go to the second step
  //   fireEvent.click(getByText("Next"));
  //   expect(
  //     await queryByText("Fetching the study from the server...")
  //   ).toBeInTheDocument();

  //   // Go to the third step
  //   expect(download).toHaveBeenCalled();

  //   fireEvent.click(getByText("Next"));
  //   expect(
  //     await queryByText("Quick check that the study is correct")
  //   ).toBeInTheDocument();

  //   // Go to the fourth step
  //   expect(deconstructStudy).toHaveBeenCalledWith(study);
  //   fireEvent.click(getByText("Next"));
  //   expect(
  //     await findByText("Everything worked as expected")
  //   ).toBeInTheDocument();
  //   expect(useStore().setAtoms).toHaveBeenCalledWith(atoms);

  //   // Close the dialog
  //   expect(close).toHaveBeenCalledTimes(0);
  //   fireEvent.click(getByRole("button", { name: "Close" }));
  //   expect(close).toHaveBeenCalledTimes(1);
  // });

  it("displays an error message if a step fails", async () => {
    download.mockRejectedValue("Failed to download the study");

    const { getByLabelText, getByText, queryByText } = render(
      <Download close={close} />
    );

    // Go to the second step
    fireEvent.click(getByText("Next"));
    expect(await getByText("Failed to download the study")).toBeTruthy();
    expect(getByLabelText("Study ID", { selector: "input" })).toHaveAttribute("value", "");

    // Go back to the first step
    fireEvent.click(getByText("Previous"));
    expect(getByLabelText("Study ID", { selector: "input" })).toBeInTheDocument();
  });
  
});
