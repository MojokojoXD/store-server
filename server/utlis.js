const determineShipping = (customer) => {
  if (customer.hasOwnProperty("shipping")) {
    console.log(customer.shipping);
    const { shipping } = customer;
    return {
      addressLine1: shipping.addressLines1,
      addressLine2: shipping.addressLines2 ? shipping.addressLines2 : "",
      administrativeDistrictLevel1: shipping.state,
      country: "US",
      locality: capitalizeFirstLetter(shipping.city),
      postalCode: shipping.zipcode,
    };
  }

  return {
    addressLine1: customer.addressLines1,
    addressLine2: customer.addressLines2 ? customer.addressLines2 : "",
    administrativeDistrictLevel1: customer.state,
    country: "US",
    locality: capitalizeFirstLetter(customer.city),
    postalCode: customer.zipcode,
  };
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports = {
    capitalize: capitalizeFirstLetter,
    shipping: determineShipping,
}