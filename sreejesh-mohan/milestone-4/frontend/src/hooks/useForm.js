import { useState } from 'react';

// useForm hook handling multiple inputs, touched state & validation (Session 32, 34)
export function useForm(initialValues, validateFn) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(newData);
    if (touched[name] && validateFn) {
      setErrors(validateFn(newData));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validateFn) {
      setErrors(validateFn(formData));
    }
  }

  async function handleSubmit(onSubmitCallback) {
    // Touch all fields to reveal validation on submit attempt (Session 32)
    const allTouched = Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validateFn ? validateFn(formData) : {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return false; // prevent submission
    }

    setIsSubmitting(true);
    try {
      await onSubmitCallback(formData);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }

  function getFieldError(name) {
    return touched[name] ? errors[name] : undefined;
  }

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldError,
    setFormData
  };
}
