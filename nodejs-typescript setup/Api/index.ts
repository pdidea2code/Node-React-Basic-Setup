import express, { Request, Response, NextFunction } from "express";
import mongoose, { Document } from "mongoose";
import bodyParser from "body-parser";
// import cors from "cors";
import http from "http";
import path from "path";
// import Stripe from "stripe";
// import Order from "./models/Order";
// import PromoCode from "./models/Promocode";
// import AppSetting from "./models/AppSetting";
import { successResponse, queryErrorRelatedResponse } from "./helper/sendResponse";

// Get error controller
import { errorHandler } from "./helper/errorController";

const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// MongoDB Connection
// mongoose.connect(process.env.DB_CONNECTION!, {
//     // No need for useNewUrlParser and useUnifiedTopology
//   })
//     .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.error("MongoDB connection error:", err));

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "Connection Error"));
// db.once("open", () => {
//   console.log("Connected to MongoDB successfully");
// });

// Stripe Webhook
// app.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const sig = req.headers["stripe-signature"];

//       let event: Stripe.Event;
//       const appSetting = await AppSetting.findOne({});
//       const endpointSecret = appSetting?.stripe_webhook_secret;

//       if (!endpointSecret) {
//         return queryErrorRelatedResponse(res, 500, "Webhook secret not found");
//       }

//       try {
//         event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//       } catch (err) {
//         console.error(err);
//         return queryErrorRelatedResponse(res, 400, err.message);
//       }

//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const order = await Order.findOne({
//           paymentIntentId: session.id,
//         });

//         if (!order) {
//           return queryErrorRelatedResponse(res, 404, "Order not found");
//         }

//         const promoCode = await PromoCode.findById(order.promocode_id);
//         if (promoCode) {
//           promoCode.usesCount += 1;
//           promoCode.user_ids.push(order.user_id);
//           promoCode.totalDiscountAmount += order.discount_amount;
//           await promoCode.save();
//         }

//         order.paymentstatus = "SUCCESS";
//         order.order_status = "PENDING";
//         order.paymentIntentId = session.payment_intent;
//         await order.save();

//         return successResponse(res, {
//           message: "Payment verified and order completed successfully",
//           order,
//         });
//       }

//       if (event.type === "checkout.session.expired") {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const order = await Order.findOne({
//           paymentIntentId: session.id,
//         });

//         if (!order) {
//           return queryErrorRelatedResponse(res, 404, "Order not found");
//         }

//         order.paymentstatus = "FAILED";
//         order.order_status = "CANCELLED";
//         order.paymentIntentId = session.payment_intent;
//         await order.save();

//         return successResponse(res, {
//           message: "Payment expired and order cancelled",
//           order,
//         });
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// BodyParser Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
import adminRoutes from "./routes/admin";
app.use("/api/admin", adminRoutes);

// import userRoute from "./routes/app";
// app.use("/api/user", userRoute);

// Error Handling Middleware
app.use(errorHandler);

// Static Files
// app.use("/public", express.static(path.join(__dirname, "./public/images/")));
// app.use("/userprofileimg", express.static(path.join(__dirname, "./public/userprofileimg/")));
// app.use("/showcaseimg", express.static(path.join(__dirname, "./public/showcaseimg/")));
// app.use("/serviceimg", express.static(path.join(__dirname, "./public/serviceimg/")));
// app.use("/addonsimg", express.static(path.join(__dirname, "./public/addonsimg/")));
// app.use("/appsettingimg", express.static(path.join(__dirname, "./public/appsettingimg/")));
// app.use("/blogimg", express.static(path.join(__dirname, "./public/blogimg/")));
// app.use("/userthemeimg", express.static(path.join(__dirname, "./public/userthemeimg/")));

// Server Port
const port = process.env.PORT || 3300;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
