import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox() {
  return (
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  );
}
