import PropTypes from 'prop-types';
import { Overlay } from './styles';
import Spinner from '../Spinner';
import ReactPortal from '../ReactPortal';
import useAnimatedUnmout from '../../hooks/useAnimatedUnmount';

export default function Loader({ isLoading }) {
  const { shouldRender, animatedElementRef } = useAnimatedUnmout(isLoading);

  if (!shouldRender) {
    return null;
  }

  return (
    <ReactPortal containerID="loader-root">
      <Overlay ref={animatedElementRef} isLeaving={!isLoading}>
        <Spinner size={90} />
      </Overlay>
    </ReactPortal>
  );
}

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
