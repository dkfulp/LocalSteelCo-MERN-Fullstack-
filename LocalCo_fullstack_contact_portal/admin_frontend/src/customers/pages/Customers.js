import React, { useEffect, useState } from 'react';

import CustomerList from '../components/CustomerList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Customers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCustomers, setLoadedCustomers] = useState();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/customers/'
        );

        setLoadedCustomers(responseData.customers);
      } catch (err) {}
    };
    fetchCustomers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCustomers && <CustomerList items={loadedCustomers} />}
    </React.Fragment>
  );
};

export default Customers;
