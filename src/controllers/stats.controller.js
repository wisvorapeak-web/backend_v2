const Registration = require('../models/registration.model');
const Schedule = require('../models/schedule.model');
const User = require('../models/user.model');

exports.getOverviewStats = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const scheduledSessions = await Schedule.countDocuments();
    const activeUsers = await User.countDocuments();

    const allRegs = await Registration.find({});
    
    let totalRevenue = 0;
    
    // Revenue Data (last 7 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueByMonth = {};
    const regByDay = { "Mon": { visitors: 0, exhibitors: 0 }, "Tue": { visitors: 0, exhibitors: 0 }, "Wed": { visitors: 0, exhibitors: 0 }, "Thu": { visitors: 0, exhibitors: 0 }, "Fri": { visitors: 0, exhibitors: 0 }, "Sat": { visitors: 0, exhibitors: 0 }, "Sun": { visitors: 0, exhibitors: 0 } };

    // Initialize last 7 months
    const d = new Date();
    const last7Months = [];
    for(let i=6; i>=0; i--) {
      const past = new Date(d.getFullYear(), d.getMonth() - i, 1);
      last7Months.push(monthNames[past.getMonth()]);
      revenueByMonth[monthNames[past.getMonth()]] = 0;
    }

    allRegs.forEach(reg => {
      const date = new Date(reg.createdAt);
      
      // Calculate revenue
      if (reg.status === 'Paid') {
        const amt = parseFloat(reg.total_amount || reg.amount || 0); // Handle both formats
        if (!isNaN(amt)) {
            totalRevenue += amt;
            const month = monthNames[date.getMonth()];
            if (revenueByMonth[month] !== undefined) {
                revenueByMonth[month] += amt;
            }
        }
      }

      // Calculate registrations by day
      const dayIndex = date.getDay();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = days[dayIndex];
      
      const isExhibitor = (reg.package_name && reg.package_name.toLowerCase().includes('exhibit')) || (reg.category && reg.category.toLowerCase().includes('sponsor'));
      if (isExhibitor) {
          regByDay[dayName].exhibitors += 1;
      } else {
          regByDay[dayName].visitors += 1;
      }
    });

    const revenueData = last7Months.map(m => ({ name: m, total: revenueByMonth[m] }));
    const registrationData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ name: d, visitors: regByDay[d].visitors, exhibitors: regByDay[d].exhibitors }));

    res.status(200).json({
      success: true,
      data: {
        revenue: totalRevenue,
        registrations: totalRegistrations,
        scheduledSessions: scheduledSessions,
        activeUsers: activeUsers,
        revenueData,
        registrationData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
