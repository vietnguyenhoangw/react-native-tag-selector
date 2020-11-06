import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewPropTypes,
} from "react-native";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";

export class TagSelector extends Component {
  /**
   * Tag selector
   *
   * @param {Function} onChange callback on change with one (tagsSelected) param - array of selected tags' id
   * @param {Number} maxHeight max height of view to allow before appears 'Show more' text and folding functionality
   * @param {Array} tags array of tags to render - objects of type {id: string, name: string}
   * @param {Array} defaultSelectedTag default selected app
   * @param {Array} expandCaptions array of expand captions - ['Show more', 'Show less']
   * @param {StyleSheet} expdandedContainerStyle style of expanded container
   * @param {StyleSheet} containerStyle style of default container
   * @param {StyleSheet} selectedTagStyle selected tag style
   * @param {StyleSheet} tagContainerStyle selected tag style
   * @param {StyleSheet} tagStyle default tag style
   * @param {StyleSheet} separatorStyle separator between tags and expand button style
   * @param {StyleSheet} expandBtnStyle expand button style
   * @param {StyleSheet} expandTextStyle expand button text style
   * @param {StyleSheet} selectTextStyle expand button text style
   * @param {Array} gradientColor gradient button select colors ['color1', 'color2']
   */

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      overflowed: false,
      tagsSelected: props.defaultSelectedTag ? props.defaultSelectedTag : [],
    };
  }

  onTagSelected = (key) => {
    const tagsSelected = this.state.tagsSelected.includes(key)
      ? this.state.tagsSelected.filter((i) => i !== key)
      : [...this.state.tagsSelected, key];
    this.setState({ tagsSelected: tagsSelected });
    this.props.onChange(tagsSelected);
  };

  renderTag = (tag) => {
    const {
      tagContainerStyle,
      selectedTagStyle,
      tagStyle,
      maxHeight,
      selectTextStyle,
      gradientColor,
    } = this.props;

    return !this.state.tagsSelected.includes(tag.id) ? (
      <View>
        <Text
          style={tagStyle}
          onPress={() => this.onTagSelected(tag.id)}
          key={tag.id}
          onLayout={maxHeight > 0 ? this.onLayoutTag : () => {}}
        >
          {tag.name}
        </Text>
      </View>
    ) : (
      <LinearGradient colors={gradientColor} style={selectedTagStyle}>
        <Text
          style={selectTextStyle}
          onPress={() => this.onTagSelected(tag.id)}
          key={tag.id}
          onLayout={maxHeight > 0 ? this.onLayoutTag : () => {}}
        >
          {tag.name}
        </Text>
      </LinearGradient>
    );
  };

  onExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  onLayoutTag = (event) => {
    const { y } = event.nativeEvent.layout;
    if (!this.state.overflowed && y > this.props.maxHeight) {
      this.setState({ overflowed: true });
    }
  };

  render() {
    const {
      maxHeight,
      containerStyle,
      expdandedContainerStyle,
      expandCaptions,
      separatorStyle,
      expandBtnStyle,
      expandTextStyle,
    } = this.props;

    return (
      <View>
        <View
          style={
            this.state.expanded
              ? expdandedContainerStyle
              : [
                  containerStyle,
                  maxHeight > 0 ? { maxHeight: this.props.maxHeight } : {},
                ]
          }
        >
          {this.props.tags.map((i) => this.renderTag(i))}
        </View>
        {this.state.overflowed ? (
          <View style={separatorStyle}>
            <TouchableOpacity style={expandBtnStyle} onPress={this.onExpand}>
              <Text style={expandTextStyle}>
                {this.state.expanded ? expandCaptions[1] : expandCaptions[0]}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

TagSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  maxHeight: PropTypes.number,
  tags: PropTypes.array.isRequired,
  defaultSelectedTag: PropTypes.array,
  expandCaptions: PropTypes.array,
  gradientColor: PropTypes.array,
  expdandedContainerStyle: ViewPropTypes.style,
  containerStyle: ViewPropTypes.style,
  selectedTagStyle: Text.propTypes.style,
  tagContainerStyle: Text.propTypes.style,
  tagStyle: Text.propTypes.style,
  separatorStyle: ViewPropTypes.style,
  expandBtnStyle: ViewPropTypes.style,
  expandTextStyle: Text.propTypes.style,
  selectTextStyle: Text.propTypes.style,
};

const styles = StyleSheet.create({
  btnText: {
    fontSize: 12,
    textAlign: "right",
    padding: 0,
  },
  btnStyle: {
    height: 25,
    justifyContent: "flex-start",
    alignSelf: "flex-end",
  },
  showMore: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "grey",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
  },
  containerExpanded: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    alignSelf: "center",
    fontSize: 12,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: 32,
    margin: 2,
    backgroundColor: "#EBF1FD",
  },
  tagSelected: {
    alignSelf: "center",
    fontSize: 12,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: 32,
    margin: 2,
    color: "white",
    backgroundColor: "#6242f4",
  },
  selectTextStyles: {
    color: "white",
    height: 40,
    lineHeight: 50,
    alignSelf: "center",
  },
});

TagSelector.defaultProps = {
  expandCaptions: ["more", "less"],
  gradientColor: ["#EA3BA8", "#EB494A"],
  expdandedContainerStyle: styles.containerExpanded,
  containerStyle: styles.container,
  selectedTagStyle: styles.tagSelected,
  tagStyle: styles.tag,
  separatorStyle: styles.showMore,
  expandBtnStyle: styles.btnStyle,
  expandTextStyle: styles.btnText,
  selectTextStyle: styles.selectTextStyles,
  maxHeight: 0,
};

export default TagSelector;
