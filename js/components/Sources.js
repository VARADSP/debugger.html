"use strict";

const React = require("react");
const {DOM: dom} = React;
const { bindActionCreators } = require("redux");
const { connect } = require("react-redux");
const actions = require("../actions");
const { getSelectedSource } = require("../queries");
require("./Sources.css");

function renderSource({source, selectSource, selectedSource}) {
  const pathname = (new URL(source.get("url"))).pathname;
  const isSelected = (selectedSource &&
                      selectedSource.actor == source.get("actor"))
                      ? "selected" : "";

  return dom.li(
    { onClick: () => selectSource(source.toJS()),
      className: "source-item " + isSelected,
      style: { paddingLeft: "40px" },
      key: source.get("url")},
    pathname
  );
}

/**
 * Takes a sources object indexed by actor and
 * returns a sources object indexed by source domain.
 *
 * @returns Object
 */
function groupSourcesByDomain(sources) {
  return sources.valueSeq()
    .filter(source => !!source.get("url"))
    .groupBy(source => (new URL(source.get("url"))).hostname);
}

function Sources({ sources, selectSource, selectedSource }) {
  const sourcesByDomain = groupSourcesByDomain(sources);

  return dom.ul(
    {className: "sources-list"},
    sourcesByDomain.map((domainSources, domain) => {
      return dom.li({ key: domain, className: "domain" },
        dom.span({style: { paddingLeft: "20px" }}, domain),
        dom.ul(null,
          domainSources.map(source => renderSource({
            source, selectSource, selectedSource }))
        )
      );
    })
  );
}

module.exports = connect(
  state => ({ selectedSource: getSelectedSource(state) }),
  dispatch => bindActionCreators(actions, dispatch)
)(Sources);
