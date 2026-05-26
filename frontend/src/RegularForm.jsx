import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegularServiceMutation } from "../../redux/serviceSlice";

const STORAGE_KEY = "pestxz_saved_services";

// Flatten nested name-keyed object:
// { serviceName: { scopeName: { consumableName: value } } }
// → { scopeName: { consumableName: value } }
// (backend only needs scope→consumable level)
const flattenObject = (obj = {}) => {
  const result = {};

  Object.values(obj).forEach((scopeObj) => {
    Object.entries(scopeObj).forEach(([scopeName, consumables]) => {
      result[scopeName] = consumables;
    });
  });

  return result;
};

function RegularForm({ serviceData, id }) {
  const [regularService, { isLoading }] = useRegularServiceMutation();

  const { register, handleSubmit, reset, setValue, getValues } = useForm();

  // Restore saved progress from localStorage (keyed by names)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([key, value]) => {
        setValue(key, value);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Save a single service's progress locally, keyed by service name
  const saveLocally = (serviceName) => {
    const values = getValues();

    let existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    ["usedCalibration", "action", "comment"].forEach((field) => {
      existing[field] = {
        ...existing[field],
        [serviceName]: values?.[field]?.[serviceName] || {},
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    toast.success("Saved locally 🚀");
  };

  const onSubmit = async (data) => {
    try {
      const form = new FormData();

      // Send the full serviceData array (not spread into an object)
      form.append(
        "service",
        JSON.stringify(serviceData.map((ser) => ({ ...ser, locationId: id }))),
      );

      form.append(
        "usedCalibration",
        JSON.stringify(flattenObject(data.usedCalibration)),
      );

      form.append("action", JSON.stringify(flattenObject(data.action)));

      form.append("comment", JSON.stringify(flattenObject(data.comment)));

      // Key each image by serviceName + index (max 2) so backend can match them
      serviceData.forEach((ser) => {
        const files = data?.image?.[ser.serviceName];
        if (files) {
          Array.from(files)
            .slice(0, 2)
            .forEach((file, i) => {
              form.append(`image_${ser.serviceName}_${i}`, file);
            });
        }
      });

      const res = await regularService({ id, form }).unwrap();

      toast.success(res.msg || "Submitted 🎉");

      localStorage.removeItem(STORAGE_KEY);
      reset();
    } catch (err) {
      console.log(err);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="w-full overflow-auto outline outline-gray-400 rounded-2xl">
      <div className="min-w-[1200px] p-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Regular Service Form</h2>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
          {serviceData?.map((ser) => (
            <div
              key={ser.serviceName}
              className="outline outline-gray-400 rounded p-4 bg-white shadow"
            >
              <div className="flex justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <p className="text-lg font-semibold outline px-2 py-1 rounded outline-gray-400">
                    service name:{" "}
                    <span className="text-base text-gray-500">
                      {ser.serviceName}
                    </span>
                  </p>
                  <p className="text-lg font-semibold outline px-2 py-1 rounded outline-gray-400">
                    Frequency:{" "}
                    <span className="text-base text-gray-500">
                      {ser.frequency}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveLocally(ser.serviceName)}
                  className="px-3 py-2 border rounded"
                >
                  Save Progress
                </button>
              </div>

              {/* Up to 2 images per service */}
              <input
                type="file"
                multiple
                accept="image/*"
                {...register(`image.${ser.serviceName}`, {
                  validate: (files) =>
                    !files || files.length <= 2 || "Max 2 images allowed",
                })}
              />

              {ser.scopes?.map((sc) => (
                <div key={sc.scopeName} className="mt-4 outline outline-gray-400 p-3 rounded">
                  <h4 className="font-medium mb-3">{sc.scopeName}</h4>

                  {sc.consumables?.map((con) => (
                    <div
                      key={con.consumableName}
                      className="grid grid-cols-5 gap-3 mb-3"
                    >
                      <input
                        defaultValue={con.consumableName}
                        disabled
                        className="outline outline-gray-400 p-2 bg-gray-100"
                      />

                      <input
                        defaultValue={con.calibration}
                        disabled
                        className="outline outline-gray-400 p-2 bg-gray-100"
                      />

                      {/* All fields keyed by name, not ID */}
                      <input
                        placeholder="Used"
                        {...register(
                          `usedCalibration.${ser.serviceName}.${sc.scopeName}.${con.consumableName}`,
                        )}
                        className="outline outline-gray-400 p-2"
                      />

                      <select
                        {...register(
                          `action.${ser.serviceName}.${sc.scopeName}.${con.consumableName}`,
                        )}
                        className="outline outline-gray-400 p-2"
                      >
                        <option>Done</option>
                        <option>Not Done</option>
                        <option>Partial Done</option>
                      </select>

                      <textarea
                        rows={1}
                        placeholder="comment..."
                        {...register(
                          `comment.${ser.serviceName}.${sc.scopeName}.${con.consumableName}`,
                        )}
                        className="outline outline-gray-400 p-2"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 px-8 py-3 text-white rounded"
            >
              {isLoading ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegularForm;
