import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { useQueryParam, NumberParam } from 'use-query-params'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import StoreContext from '~/context/StoreContext'
import ProductCell from '../ProductCell'
import {
  Grid,
  Pagination,
  PaginationList,
  PaginationButton,
  EmptyText,
} from './styles'

const ProductGridForCollection = ({ collection }) => {
  const {
    store: { checkout },
  } = useContext(StoreContext)
  const [page, setPage] = useQueryParam('page', NumberParam)
  const { products } = collection

  const pageChunk = _.chunk([...products], 24)

  useEffect(() => {
    if (!page) {
      setPage(1)
    }
  }, [])

  const getPrice = price =>
    Intl.NumberFormat(undefined, {
      currency: checkout.currencyCode ? checkout.currencyCode : 'EUR',
      minimumFractionDigits: 2,
      style: 'currency',
    }).format(parseFloat(price ? price : 0))

  return (
    <>
      {pageChunk[page - 1] ? (
        <Grid>
          {pageChunk[page - 1].map(
            ({ id, handle, title, images, variants }) => (
              <ProductCell
                key={id}
                availableForSale={
                  variants.filter(v => v.availableForSale === true).length >= 1
                }
                handle={handle}
                images={images}
                price={getPrice(variants[0].price)}
                title={title}
              />
            )
          )}
        </Grid>
      ) : (
        <EmptyText>Coming Soon</EmptyText>
      )}
      <Pagination>
        {pageChunk.length > 1 &&
          pageChunk.map((_, i) => (
            <PaginationList key={i}>
              <PaginationButton
                isCurrent={page === i + 1}
                key={i}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationButton>
            </PaginationList>
          ))}
      </Pagination>
    </>
  )
}

ProductGridForCollection.propTypes = {
  collection: PropTypes.object.isRequired,
}

export default ProductGridForCollection
