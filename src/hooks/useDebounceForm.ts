import { Dispatch, SetStateAction, useEffect } from "react";
import { DeepPartial, FieldValues, useForm } from "react-hook-form";
import { useDebounce } from "./useDebounce";

export const useDebounceForm = <T extends FieldValues>(
  { debounceDelay, defaultValues, setFormData }: {
    defaultValues: DeepPartial<T>;
    setFormData: Dispatch<SetStateAction<T>>;
    debounceDelay: number;
  },
) => {
  const debounceHandler = useDebounce(setFormData, debounceDelay, [
    setFormData,
    debounceDelay,
  ]);

  const formData = useForm<T>({
    defaultValues,
  });

  useEffect(() => {
    const subscription = formData.watch(
      formData.handleSubmit(debounceHandler) as any,
    );

    return () => subscription.unsubscribe();
  }, [formData.handleSubmit, formData.watch]);

  return formData;
};
