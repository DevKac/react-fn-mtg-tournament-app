const FormInvalidFeedback = ({formValidated, errorsList}) => {
  return (
    !formValidated || errorsList?.length ?
      errorsList.map((errorMsg, index) => 
        <div key={index} className='invalid-feedback'>
          { errorMsg }
        </div>
      ) : '' 
  );
}

export default FormInvalidFeedback;
