import PreviousUploads from './PreviousUploads';
import UploadCard from './UploadCard';

const UploadDocuments = () => {
  return (
    <>
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
        <div className="flex flex-col lg:flex-row gap-15 px-6 py-5 align-middle items-center justify-center mt-10">
          <UploadCard />
          <PreviousUploads />
        </div>
      {/* </div> */}
    </>
  );
}

export default UploadDocuments