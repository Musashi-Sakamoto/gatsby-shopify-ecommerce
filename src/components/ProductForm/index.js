import React, { useState, useContext, useEffect, useCallback } from 'react'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import Notifications, { notify } from 'react-notify-toast'

import StoreContext from '~/context/StoreContext'

import {
  PriceTag,
  Label,
  QuantityInput,
  QuantityMinusButton,
  Quantity,
  QuantityPlusButton,
  VariantSection,
  VariantSelect,
  AddCartButton,
} from './styles'

const ProductForm = ({ product }) => {
  const {
    options,
    variants,
    variants: [initialVariant],
    priceRange: { minVariantPrice },
  } = product
  const [variant, setVariant] = useState({ ...initialVariant })
  const [quantity, setQuantity] = useState(1)
  const {
    addVariantToCart,
    store: { client, adding },
  } = useContext(StoreContext)

  const productVariant =
    client.product.helpers.variantForOptions(product, variant) || variant
  const [available, setAvailable] = useState(productVariant.availableForSale)

  const checkAvailability = useCallback(
    productId => {
      client.product.fetch(productId).then(fetchedProduct => {
        // this checks the currently selected variant for availability
        const result = fetchedProduct.variants.filter(
          variant => variant.id === productVariant.shopifyId
        )
        if (result.length > 0) {
          setAvailable(result[0].available)
        }
      })
    },
    [client.product, productVariant.shopifyId, variants]
  )

  useEffect(() => {
    checkAvailability(product.shopifyId)
  }, [productVariant, checkAvailability, product.shopifyId])

  const handleQuantityChange = ({ target }) => {
    setQuantity(target.value)
  }

  const handleOptionChange = (optionIndex, { target }) => {
    const { value } = target
    const currentOptions = [...variant.selectedOptions]

    currentOptions[optionIndex] = {
      ...currentOptions[optionIndex],
      value,
    }

    const selectedVariant = find(variants, ({ selectedOptions }) =>
      isEqual(currentOptions, selectedOptions)
    )

    setVariant({ ...selectedVariant })
  }

  const handleAddToCart = () => {
    addVariantToCart(productVariant.shopifyId, quantity)
    notify.show('item added', 'custom', 3000, {
      background: '#303030',
      text: '#ffffff',
    })
  }

  /* 
  Using this in conjunction with a select input for variants 
  can cause a bug where the buy button is disabled, this 
  happens when only one variant is available and it's not the
  first one in the dropdown list. I didn't feel like putting 
  in time to fix this since its an edge case and most people
  wouldn't want to use dropdown styled selector anyways - 
  at least if the have a sense for good design lol.
  */
  const checkDisabled = (name, value) => {
    const match = find(variants, {
      selectedOptions: [
        {
          name: name,
          value: value,
        },
      ],
    })
    if (match === undefined) return true
    if (match.availableForSale === true) return false
    return true
  }

  const price = Intl.NumberFormat(undefined, {
    currency: minVariantPrice.currencyCode,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(variant.price)

  return (
    <>
      <Notifications />
      <PriceTag>{price}</PriceTag>
      <Label htmlFor="quantity">QUANTITY</Label>
      <Quantity>
        <QuantityMinusButton
          onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
        >
          -
        </QuantityMinusButton>
        <QuantityInput
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          step="1"
          onChange={handleQuantityChange}
          value={quantity}
        />
        <QuantityPlusButton
          onClick={() => setQuantity(quantity ? quantity + 1 : 1)}
        >
          +
        </QuantityPlusButton>
      </Quantity>

      {options.map(({ id, name, values }, index) => (
        <VariantSection key={id}>
          <Label htmlFor={name}>{name} </Label>
          <VariantSelect
            name={name}
            key={id}
            onChange={event => handleOptionChange(index, event)}
          >
            {values.map(value => (
              <option
                value={value}
                key={`${name}-${value}`}
                disabled={checkDisabled(name, value)}
              >
                {value}
              </option>
            ))}
          </VariantSelect>
          <br />
        </VariantSection>
      ))}
      <br />
      <AddCartButton
        type="submit"
        disabled={!available || adding}
        onClick={handleAddToCart}
      >
        {!available ? 'OUT OF STOCK' : 'ADD TO CART'}
      </AddCartButton>
    </>
  )
}

ProductForm.propTypes = {
  product: PropTypes.shape({
    descriptionHtml: PropTypes.string,
    handle: PropTypes.string,
    id: PropTypes.string,
    shopifyId: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        originalSrc: PropTypes.string,
      })
    ),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    productType: PropTypes.string,
    title: PropTypes.string,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        availableForSale: PropTypes.bool,
        id: PropTypes.string,
        price: PropTypes.string,
        title: PropTypes.string,
        shopifyId: PropTypes.string,
        selectedOptions: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
          })
        ),
      })
    ),
  }),
  addVariantToCart: PropTypes.func,
}

export default ProductForm
