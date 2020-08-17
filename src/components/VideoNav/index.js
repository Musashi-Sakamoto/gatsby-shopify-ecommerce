import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'

import {
  VideoDiv,
  Container,
  Item,
  FlexContainer,
  Image,
  Label,
} from './styles'

const VideoNav = () => {
  const { allShopifyCollection } = useStaticQuery(
    graphql`
      query {
        allShopifyCollection(
          filter: { handle: { regex: "/^artists-[a-z0-9]+/" } }
          limit: 5
        ) {
          edges {
            node {
              image {
                localFile {
                  childImageSharp {
                    fluid(maxWidth: 910) {
                      ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                  }
                }
              }
              fields {
                slug
              }
              title
            }
          }
        }
      }
    `
  )
  const edges = allShopifyCollection.edges

  return (
    <Container>
      <FlexContainer>
        <Item>
          <Link to={`/collections/${edges[0].node.fields.slug}/`}>
            <Image
              fluid={edges[0].node.image.localFile.childImageSharp.fluid}
              alt={edges[0].node.title}
            />
            <Label>{edges[0].node.title}</Label>
          </Link>
        </Item>
        <Item>
          <Link to={`/collections/${edges[1].node.fields.slug}/`}>
            <Image
              fluid={edges[1].node.image.localFile.childImageSharp.fluid}
              alt={edges[1].node.title}
            />
            <Label>{edges[1].node.title}</Label>
          </Link>
        </Item>
      </FlexContainer>
      <FlexContainer>
        <Item>
          <Link to={`/collections/${edges[2].node.fields.slug}/`}>
            <Image
              fluid={edges[2].node.image.localFile.childImageSharp.fluid}
              alt={edges[2].node.title}
            />
            <Label>{edges[2].node.title}</Label>
          </Link>
        </Item>
        <Item>
          <Link to={`/collections/${edges[3].node.fields.slug}/`}>
            <Image
              fluid={edges[3].node.image.localFile.childImageSharp.fluid}
              alt={edges[3].node.title}
            />
            <Label>{edges[3].node.title}</Label>
          </Link>
        </Item>
        <Item>
          <Link to={`/collections/${edges[4].node.fields.slug}/`}>
            <Image
              fluid={edges[4].node.image.localFile.childImageSharp.fluid}
              alt={edges[4].node.title}
            />
            <Label>{edges[4].node.title}</Label>
          </Link>
        </Item>
      </FlexContainer>
      <VideoDiv>
        <iframe
          id="player"
          allowFullScreen="1"
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/ue5oHmUGiMM?autoplay=1&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;autohide=1&amp;rel=0&amp;mute=1&amp;index=4&amp;enablejsapi=1&amp;widgetid=1&amp;modestbranding=1&amp;playlist=ue5oHmUGiMM"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </VideoDiv>
    </Container>
  )
}

export default VideoNav