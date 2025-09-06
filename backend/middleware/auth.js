import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Please log in to continue"});
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Your session has expired or is invalid. Please log in again" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role)
      return res.status(403).json({ message: "You don’t have permission to access this resource"  });
    next();
  };
}
