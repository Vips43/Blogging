export const newRegularService = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ msg: "Location not found" });
    }

    // PARSE DATA — service is now a full array, all fields keyed by name
    const services = JSON.parse(req.body.service);
    const usedCalibration = JSON.parse(req.body.usedCalibration || "{}");
    const action = JSON.parse(req.body.action || "{}");
    const comment = JSON.parse(req.body.comment || "{}");

    // BUILD regularService array — one entry per service
    const regularServiceArray = await Promise.all(
      services.map(async (service) => {
        // Upload up to 2 images per service: image_<serviceName>_0, image_<serviceName>_1
        const imageLinks = await Promise.all(
          [0, 1].map(async (i) => {
            const fileKey = `image_${service.serviceName}_${i}`;
            const file = req.files?.[fileKey];
            if (!file) return null;
            return uploadFile({ filePath: file.tempFilePath });
          }),
        );

        // Filter out nulls (slots where no image was uploaded)
        const images = imageLinks.filter(Boolean);

        return {
          serviceName: service.serviceName,
          frequency: service.frequency,

          scopes: service.scopes.map((scope) => ({
            scopeName: scope.scopeName,

            consumables: scope.consumables.map((con) => ({
              consumableName: con.consumableName,
              calibration: con.calibration,

              // Look up by name (scopeName → consumableName)
              usedCalibration:
                usedCalibration?.[scope.scopeName]?.[con.consumableName] || "",

              action: action?.[scope.scopeName]?.[con.consumableName] || "Done",

              comment: comment?.[scope.scopeName]?.[con.consumableName] || "",
            })),
          })),

          images, // array of 0-2 uploaded URLs
          userName: req.user.name,
        };
      }),
    );

    await Service.create({
      type: "Regular",
      regularService: regularServiceArray,
      client: location.client,
      location: id,
    });

    return res.status(201).json({ msg: "Service updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
