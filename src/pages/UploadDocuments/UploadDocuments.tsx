import PreviousUploads from './PreviousUploads';
import UploadCard from './UploadCard';

const UploadDocuments = () => {
  return (
     <div
      className="
      w-full 
      min-h-[calc(100vh-200px)]
      flex 
      flex-col lg:flex-row 
      gap-6 lg:gap-10 sm:mt-10 mt-10
      items-center 
      justify-center
    "
    >
      <UploadCard />
      <PreviousUploads />
    </div>
  );
};

export default UploadDocuments;