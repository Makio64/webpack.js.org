// Import External Dependencies
import React from 'react';

// Import helpers
import isClient from '../../utilities/is-client';

// Load Styling
import '../Gitter/Gitter.scss';

// TODO: Use `position: sticky` over calculation
export default class Gitter extends React.Component {
  state = {
    offset: 0
  };

  _sidecar = null

  render() {
    let { offset } = this.state;

    return (
      <span className="gitter">
        <div
          className="gitter__button"
          onClick={() => window.gitterSidecar && window.gitterSidecar.toggleChat(true)}
          style={{
            marginBottom: offset
          }}>
          <i className="gitter__icon icon-gitter" />
        </div>
      </span>
    );
  }

  componentDidMount() {
    if (isClient) {
      import('gitter-sidecar').then(Sidecar => {
        if (!window.gitterSidecar) {
          window.gitterSidecar = new Sidecar({
            room: 'webpack/webpack',
            activationElement: false
          });
        }
      });

      this._timeout = setTimeout(
        this._recalculate.bind(this),
        250
      );

      document.addEventListener(
        'scroll',
        this._recalculate.bind(this)
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
    document.removeEventListener(
      'scroll',
      this._recalculate.bind(this)
    );
  }

  _recalculate(e) {
    let { scrollY, innerHeight } = window;
    let { scrollHeight } = document.body;
    let distToBottom = scrollHeight - scrollY - innerHeight;
    let footerHeight = document.querySelector('footer').offsetHeight;

    this.setState({
      offset: distToBottom < footerHeight ? footerHeight - distToBottom : 0
    });
  }
}
