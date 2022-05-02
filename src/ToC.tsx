import { Fragment } from "react";
import styled from "styled-components";
import { Form } from "../types";

const Inset = styled.div`
  margin-left: 10px;
`;

export default function ToC({ form }: { form: Form }) {
  const scroll = (id: string) => {
    const el = document.getElementById(id);
    el && el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <>
      <h2>Table of contents</h2>
      <Inset>
        <h3>Properties</h3>
        <h3>Modules</h3>
        <Inset>
          {form.modules.map((module, m_index) => (
            <Fragment key={`form_modules_${m_index}_name-label`}>
              <a onClick={() => scroll(`form_modules_${m_index}_name-label`)}>
                <p>{module.name}</p>
              </a>
              <Inset>
                {module.sections.map((section, s_index) => (
                  <Fragment key={`form_modules_${m_index}_sections_${s_index}_name-label`}>
                    <a
                      onClick={() =>
                        scroll(`form_modules_${m_index}_sections_${s_index}_name-label`)
                      }
                    >
                      {" "}
                      <p>{section.name}</p>
                    </a>
                    {section.questions.map((question, q_index) => {
                      <a
                        key={`form_modules_${m_index}_sections_${s_index}_questions_${q_index}_id-label`}
                        onClick={() =>
                          scroll(
                            `form_modules_${m_index}_sections_${s_index}_questions_${q_index}_id-label`
                          )
                        }
                      >
                        <p>{question.text}</p>
                      </a>;
                    })}
                  </Fragment>
                ))}
              </Inset>
            </Fragment>
          ))}
        </Inset>
      </Inset>
    </>
  );
}
