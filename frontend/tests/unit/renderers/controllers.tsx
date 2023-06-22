import { Download } from "../../../src/renderers/actions/Download";
import { render, userEvent, fireEvent, waitFor, getByRole, findByText } from "../../setup";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { download, validateStudy } from "../../../src/services/actions";
import { deconstructStudy } from "../../../src/utils/deconstruct";
import { useStore } from "../../../src/State";
import { Commit } from "../../../src/renderers/actions/Commit";
import { debug } from "console";


describe("Controllers testing", () => {

});