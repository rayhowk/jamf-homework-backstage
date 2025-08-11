
interface ErrorMessageValues {
    errorMessage: string;
    reason?: string;
}

const ErrorMessage = (ErrorMessageValues: ErrorMessageValues) => {
  return (
    <div style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
      <strong>{ErrorMessageValues.errorMessage}</strong>
      {ErrorMessageValues.reason && <p>{ErrorMessageValues.reason}</p>}
    </div>
  );
};

export default ErrorMessage;
