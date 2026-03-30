import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // USER PROFILE MANAGEMENT
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // TYPES
  public type Medicine = {
    id : Text;
    name : Text;
    category : Text;
    unitPrice : Float;
    currentStock : Nat;
    reorderPoint : Nat;
    isActive : Bool;
  };

  public type Transaction = {
    id : Text;
    medicineId : Text;
    medicineName : Text;
    category : Text;
    quantity : Nat;
    unitPrice : Float;
    totalAmount : Float;
    date : Text;
    customerId : Text;
  };

  public type Customer = {
    id : Text;
    name : Text;
    totalSpent : Float;
    orderCount : Nat;
    lastPurchaseMonth : Text;
  };

  // PERSISTENT STATE
  let medicines = Map.empty<Text, Medicine>();
  let customers = Map.empty<Text, Customer>();
  let transactions = Map.empty<Text, Transaction>();

  // MEDICINE OPERATIONS

  module Medicine {
    public func compare(m1 : Medicine, m2 : Medicine) : Order.Order {
      Text.compare(m1.id, m2.id);
    };
  };

  public query ({ caller }) func getMedicineById(id : Text) : async Medicine {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view medicine data");
    };
    switch (medicines.get(id)) {
      case (?med) { med };
      case (null) { Runtime.trap("Medicine not found") };
    };
  };

  public query ({ caller }) func getAllMedicines() : async [Medicine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view medicine data");
    };
    medicines.values().toArray().sort();
  };

  public shared ({ caller }) func updateMedicine(input : Medicine) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update medicines");
    };
    if (not medicines.containsKey(input.id)) {
      Runtime.trap("Medicine does not exist");
    };
    medicines.add(input.id, input);
  };

  public shared ({ caller }) func addMedicine(input : Medicine) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add medicines");
    };
    if (medicines.containsKey(input.id)) {
      Runtime.trap("Medicine already exists");
    };
    medicines.add(input.id, input);
  };

  // CUSTOMER DATA

  public type HighValueCustomer = {
    id : Text;
    name : Text;
    totalSpent : Float;
    orderCount : Nat;
    lastPurchaseMonth : Text;
  };

  public query ({ caller }) func getHighValueCustomers(threshold : Float) : async [HighValueCustomer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customer data");
    };
    let highValueIter = customers.values().filter(
      func(customer) {
        customer.totalSpent >= threshold;
      }
    );

    highValueIter.toArray().map(
      func(c) {
        {
          id = c.id;
          name = c.name;
          totalSpent = c.totalSpent;
          orderCount = c.orderCount;
          lastPurchaseMonth = c.lastPurchaseMonth;
        };
      }
    );
  };

  public type FrequentCustomer = {
    id : Text;
    name : Text;
    totalSpent : Float;
    orderCount : Nat;
    lastPurchaseMonth : Text;
  };

  public query ({ caller }) func getFrequentCustomers(threshold : Nat) : async [FrequentCustomer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customer data");
    };
    let frequentIter = customers.values().filter(
      func(customer) {
        customer.orderCount >= threshold;
      }
    );

    frequentIter.toArray().map(
      func(c) {
        {
          id = c.id;
          name = c.name;
          totalSpent = c.totalSpent;
          orderCount = c.orderCount;
          lastPurchaseMonth = c.lastPurchaseMonth;
        };
      }
    );
  };
};
