const cron = require("node-cron");

exports.init = () => {
  cron.schedule("0 0 * * *", async () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    try {
      const res = await SupportRequest.updateMany(
        { status: "Refund Pending", createdAt: { $lte: oneDayAgo } },
        { $set: { status: "Refund Sent" } }
      );
      console.log("CRON job executed successfully.", res);
    } catch (error) {
      console.error("Error updating documents for CRON JOB:", error);
    }
  });
};
