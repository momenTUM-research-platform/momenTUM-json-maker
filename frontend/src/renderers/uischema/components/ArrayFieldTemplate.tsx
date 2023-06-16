
import { ArrayFieldTemplateItemType } from '@rjsf/utils';
import { Grid, Box, Paper } from '@mui/material';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';

import {
  getTemplate,
  getUiOptions,
  ArrayFieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

/** The `ArrayFieldTemplate` component is the template used to render all items in an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldTemplateProps<T, S, F>) {
  const {
    canAdd,
    disabled,
    idSchema,
    uiSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
  } = props;
  const uiOptions = getUiOptions(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<
    "ArrayFieldDescriptionTemplate",
    T,
    S,
    F
  >("ArrayFieldDescriptionTemplate", registry, uiOptions);

  const ArrayFieldTitleTemplate = getTemplate<
    "ArrayFieldTitleTemplate",
    T,
    S,
    F
  >("ArrayFieldTitleTemplate", registry, uiOptions);
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  return (
    <Paper elevation={0} sx={{ border: "0.5px solid #000" }}>
      <Box p={4}>
        <ArrayFieldTitleTemplate
          idSchema={idSchema}
          title={uiOptions.title || title}
          schema={schema}
          uiSchema={uiSchema}
          required={required}
          registry={registry}
        />
        <ArrayFieldDescriptionTemplate
          idSchema={idSchema}
          description={uiOptions.description || schema.description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
        <Grid container={true} key={`array-item-list-${idSchema.$id}`}>
          {items &&
            items.map(
              ({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
                <ArrayFieldItemTemplate key={key} {...itemProps} />
              )
            )}
          {canAdd && (
            <Grid container justifyContent="flex-end">
              <Grid item={true}>
                <Box mt={1}>
                  <AddButton
                    className="array-item-add"
                    onClick={onAddClick}
                    disabled={disabled || readonly}
                    uiSchema={uiSchema}
                    registry={registry}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
}
