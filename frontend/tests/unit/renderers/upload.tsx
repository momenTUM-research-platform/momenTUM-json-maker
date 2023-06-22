import { useStore } from "../../../src/State";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../setup";
import userEvent from "@testing-library/user-event";
import { Upload } from "../../../src/renderers/actions/Upload";
import { validateStudy } from '../../../src/services/actions';

vi.mock("../../../src/state");
vi.mock("../../../src/renderers/actions/Upload");
vi.mock("../../utils/construct");
