import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default function ReactPortal({ containerID, children }) {
  let container = document.getElementById(containerID);

  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', containerID);
    document.body.appendChild(container);
  }

  return ReactDOM.createPortal(children, container);
}

ReactPortal.PropTypes = {
  containerID: PropTypes.string,
  children: PropTypes.node.isRequired,
};
