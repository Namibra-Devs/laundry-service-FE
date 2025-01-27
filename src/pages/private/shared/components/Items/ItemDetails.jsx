import useAppContext from "@/hooks/useAppContext";
import { iconDictionary } from "@/lib/data/IconsDictionary";

const ItemDetails = () => {
  const { currentItem: item } = useAppContext();
  const { branches } = useAppContext();

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };
  return (
    <div>
      <div className="flex items-center space-x-5">
        <div className="bg-gray-100 w-[10rem] h-[10rem] p-4 rounded-full flex items-center justify-center">
          {iconDictionary[item?.name.toLowerCase()] ? (
            <img
              src={iconDictionary[item?.name.toLowerCase()]}
              alt={item?.name}
              width={70}
            />
          ) : (
            <p className="text-6xl">📦</p>
          )}
        </div>
        <h3 className="text-2xl font-semibold">{item?.name}</h3>
      </div>

      <div>
        {item?.pricing?.map((price, index) => (
          <div key={index} className="p-5 rounded-md bg-gray-100 mt-5">
            <div className="flex items-center justify-between my-3">
              <p>Branch</p>
              <p>{getBranchName(price?.branch?.name)}</p>
            </div>
            <div className="flex items-center justify-between my-3">
              <p>Wash Price</p>
              <p>GHC {price?.washingPrice}</p>
            </div>
            <div className="flex items-center justify-between my-3">
              <p>Iron Price</p>
              <p>GHC {price?.ironingPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemDetails;
