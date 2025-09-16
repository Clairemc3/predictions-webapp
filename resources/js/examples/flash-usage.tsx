// Example usage of the simplified flash message system

import React from 'react';
import { useFlash } from '../components/flash-provider';

// In any component, you can now use:
const ExampleComponent = () => {
  const { showFlash } = useFlash();

  const handleSuccess = () => {
    showFlash({
      type: 'success',
      message: 'Operation completed successfully!',
      title: 'Success' // optional
    });
  };

  const handleError = () => {
    showFlash({
      type: 'error',
      message: 'Something went wrong. Please try again.',
      title: 'Error' // optional
    });
  };

  const handleInfo = () => {
    showFlash({
      type: 'info',
      message: 'Here is some information for you.',
    });
  };

  const handleWarning = () => {
    showFlash({
      type: 'warning',
      message: 'Please be careful with this action.',
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleInfo}>Show Info</button>
      <button onClick={handleWarning}>Show Warning</button>
    </div>
  );
};

/*
Laravel Backend Usage:

In your controllers, you can now return flash messages like this:

return redirect()->back()->with('success', 'Permission updated successfully!');
return redirect()->back()->with('error', 'Failed to update permission.');
return redirect()->back()->with('info', 'Here is some information.');
return redirect()->back()->with('warning', 'Please be careful.');

The FlashMessages component in AuthLayout will automatically detect these and show them as snackbars!
*/

export default ExampleComponent;
