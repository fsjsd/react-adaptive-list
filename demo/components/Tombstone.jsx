import React from "react";

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    boxSizing: "border-box",
    padding: "15px",
    height: "60px",
    width: "100%"
  },
  avatar: {
    backgroundColor: "#eee",
    width: "40px",
    height: "40px",
    marginRight: "10px"
  },
  background: {
    backgroundColor: "#eee",
    animationName: "color",
    animationDuration: "1s",
    animationIterationCount: "infinite"
  },
  textWrapper: {
    flexGrow: "2"
  },
  text: {
    fontSize: "10px",
    height: "15px",
    flexGrow: "2"
  }
};

function Tombstone({ style, ...restProps }) {
  return (
    <div
      style={{
        ...styles.wrapper,
        ...style
      }}
      {...restProps}
    >
      <div
        style={{
          ...styles.background,
          ...styles.avatar
        }}
      />
      <div style={styles.textWrapper}>
        <div
          style={{
            width: "20%",
            marginBottom: "10px",
            ...styles.background,
            ...styles.text
          }}
        />
        <div
          style={{
            ...styles.background,
            ...styles.text
          }}
        />
      </div>
    </div>
  );
  //#{index} {top}
}

export default Tombstone;
