import PropTypes from 'prop-types';
import { Overlay, Container, Footer } from './styles';
import Button from '../Button';
import ReactPortal from '../ReactPortal';
import useAnimatedUnmout from '../../hooks/useAnimatedUnmount';

export default function Modal({
  danger = false,
  isLoading = false,
  title,
  children,
  cancelLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  onCancel,
  onConfirm,
  visible,
}) {
  const {
    shouldRender,
    animatedElementRef,
  } = useAnimatedUnmout(visible);

  if (!shouldRender) return null;

  return (
    <ReactPortal containerID="modal-root">
      <Overlay ref={animatedElementRef} isLeaving={!visible}>
        <Container isLeaving={!visible} danger={danger}>
          <h1>{title}</h1>

          <div className="modal-body">{children}</div>

          <Footer>
            <button
              onClick={onCancel}
              type="button"
              className="cancel-button"
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <Button
              isLoading={isLoading}
              onClick={onConfirm}
              danger={danger}
              type="button"
            >
              {confirmLabel}
            </Button>
          </Footer>
        </Container>
      </Overlay>
    </ReactPortal>
  );
}

Modal.propTypes = {
  danger: PropTypes.bool,
  isLoading: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};
