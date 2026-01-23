import PreviousUploads from './PreviousUploads';
import UploadCard from './UploadCard';

const UploadDocuments = () => {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col lg:flex-row gap-6 items-center justify-center align-middle">
      <UploadCard />
      <PreviousUploads />
    </div>
  );
};

export default UploadDocuments;
