import * as React from "react";
import PropTypes from "prop-types";
import { PoseGroup } from "react-pose";

import MainMenu from "../sharedComponents/MainMenu";
import ResponsiveTitleImage from "../sharedComponents/ResponsiveTitleImage";
import { imageFadeDelay } from "../../helpers/constants";
import * as S from "./PageTemplate.styles";

const numImageSegments = 5;

const propTypes = {
  caption: PropTypes.string.isRequired,
  imageAspectRatio: PropTypes.number.isRequired,
  imageMain: PropTypes.string.isRequired,
  imageMainAlt: PropTypes.string.isRequired,
  imageMainZoom: PropTypes.string.isRequired
};

class PageTemplate extends React.Component {
  state = {
    isImageVisible: false,
    alternateImage: false
  };

  componentDidMount() {
    // make visible after mount
    setTimeout(() => {
      this.setState({ isImageVisible: !this.state.isImageVisible });
    }, 1);
  }

  flipImage() {
    this.setState({
      isImageVisible: false
    });
    setTimeout(() => {
      this.setState({
        isImageVisible: true,
        alternateImage: !this.state.alternateImage
      });
    }, imageFadeDelay / 2 + 10);
  }

  render() {
    // Note: added an extra image to the array, which becomes "index: -1", for the purpose of establishing a single
    // dummy base image with relative position whose only purpose is to mark the height for the padding-bottom trick.
    // This padding-bottom algorithm must play with the algorithm used to display multiple images on top of each other,
    // which normally needs the first one to be relative. Here, the "fake" first image is used as that placeholder.
    const images = new Array(numImageSegments + 1).fill("");
    const { props, state } = this;

    return (
      <S.Page>
        <PoseGroup>
          <S.PosedMultiImage
            imageAspectRatio={props.imageAspectRatio}
            key="posedMultiImage"
            pose={state.isImageVisible ? "visible" : "toggle"}
          >
            {images.map((image, i) => {
              let j = i - 1;
              return (
                <S.PosedImageContainer
                  imageIndex={j}
                  imageRatio={(1 / (images.length - 1)) * 100}
                  key={"image" + j}
                  numImages={images.length - 1}
                  onClick={e => {
                    this.flipImage();
                  }}
                >
                  <ResponsiveTitleImage
                    alt={props.caption}
                    imageMain={
                      state.alternateImage
                        ? props.imageMainAlt
                        : props.imageMain
                    }
                    imageMainZoom={props.imageMainZoom}
                  />
                </S.PosedImageContainer>
              );
            })}
          </S.PosedMultiImage>
        </PoseGroup>
        <S.PhotoCaption>{props.caption}</S.PhotoCaption>
        <S.BodyText>
          <S.MenuContainer>
            <MainMenu />
          </S.MenuContainer>
          {props.render()}
        </S.BodyText>
      </S.Page>
    );
  }
}

PageTemplate.propTypes = propTypes;

export default PageTemplate;
