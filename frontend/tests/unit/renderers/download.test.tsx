import { useStore } from "../../../src/state";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Download } from "../../../src/renderers/actions/Download";
import { download } from '../../../src/services/actions';
import { fireEvent, render } from "../../setup";


// Create a spy for the download function

vi.mock("/services/actions", () => ({
  download: vi.fn().mockImplementation((studyId) => {
    console.log("Download is actually being called here");
    return JSON.parse('{ some: "data" }');
  }),
}));

vi.mock("../../../src/utils/deconstruct", () => ({
  deconstructStudy: vi.fn(),
}));

// As of right now this functionality is not working so we check
// faliure

// expect(
//   await queryByText("Error: TypeError: Failed to fetch")
// ).toBeInTheDocument();

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

  it("navigates through the download process steps", async () => {
    const studyId = "some_study_id";
    const study = { id: studyId };
    const atoms = { some: "atom" };
    const deconstructedStudy = { some: "data" };
    const { getByLabelText, getByText, queryByText } = render(
      <Download close={close} />
    );

    const textField = getByLabelText("Study ID");

    fireEvent.change(textField, { target: { value: "random_id" } });

    expect(textField.value).toBe("random_id");

    // Go to the second step
    fireEvent.click(getByText("Next"));

    expect(
      await queryByText("Fetching the study from the server...")
    ).toBeInTheDocument();

    // Go to the third step
   // expect(download).toHaveBeenCalledTimes(0);

    // expect(
    //   await getByText("Error: TypeError: Failed to fetch")
    // ).toBeInTheDocument();

    // fireEvent.click(getByText("Next"));
    // expect(
    //   await queryByText("Quick check that the study is correct")
    // ).toBeInTheDocument();

    // // Go to the fourth step
    // expect(deconstructStudy).toHaveBeenCalledWith(study);
    // fireEvent.click(getByText("Next"));
    // expect(
    //   await findByText("Everything worked as expected")
    // ).toBeInTheDocument();
    // expect(useStore().setAtoms).toHaveBeenCalledWith(atoms);

    // // Close the dialog
    // expect(close).toHaveBeenCalledTimes(0);
    // fireEvent.click(getByRole("button", { name: "Close" }));
    // expect(close).toHaveBeenCalledTimes(1);
  });

  //   it("displays an error message if a step fails", async () => {
  //     download.mockRejectedValue("Failed to download the study");

  //     const { getByLabelText, getByText, queryByText } = render(
  //       <Download close={close} />
  //     );

  //     // Go to the second step
  //     fireEvent.click(getByText("Next"));
  //     debug()
  //     expect(await getByText("Failed to download the study")).toBeTruthy();
  //     expect(getByLabelText("Study ID", { selector: "input" })).toHaveAttribute("value", "");

  //     // Go back to the first step
  //     fireEvent.click(getByText("Previous"));
  //     expect(getByLabelText("Study ID", { selector: "input" })).toBeInTheDocument();
  //   });
});
