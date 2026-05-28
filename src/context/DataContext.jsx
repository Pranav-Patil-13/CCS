/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, firebaseConfig } from '../services/firebase';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [candidateProfiles, setCandidateProfiles] = useState([]);
  const [activity, setActivity] = useState([]);
  const [hrMembers, setHrMembers] = useState([]);
  const [registeredCompanies, setRegisteredCompanies] = useState([]);
  const [workspaceOwner, setWorkspaceOwner] = useState(null);
  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    if (!user) {
      setEmployees([]);
      setRequests([]);
      setEvaluations([]);
      setShareLinks([]);
      setCandidateProfiles([]);
      setActivity([]);
      setHrMembers([]);
      setRegisteredCompanies([]);
      setWorkspaceOwner(null);
    }
  }

  useEffect(() => {
    if (!user) return;
    const unsubscribes = [];

    const unsubActivity = onSnapshot(
      query(
        collection(db, "activity"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });
        setActivity(items);
      },
      (error) => {
        console.warn("Activity listener failed, falling back to empty. Error:", error);
      }
    );
    unsubscribes.push(unsubActivity);

    const unsubCompanies = onSnapshot(
      query(collection(db, "companies")),
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });
        setRegisteredCompanies(items);
      },
      (error) => {
        console.warn("Companies listener failed. Error:", error);
      }
    );
    unsubscribes.push(unsubCompanies);

    if (user.role === "company") {
      const targetCompanyId = user.companyId || user.uid;
      
      const unsubEmployees = onSnapshot(
        query(
          collection(db, "employees"),
          where("companyId", "==", targetCompanyId)
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setEmployees(items);
        }
      );
      unsubscribes.push(unsubEmployees);

      const userDomain = user.email.split("@")[1].toLowerCase();
      const unsubRequests = onSnapshot(
        query(
          collection(db, "requests"),
          where("hrEmailDomain", "==", userDomain)
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setRequests(items);
        }
      );
      unsubscribes.push(unsubRequests);

      const unsubEvals = onSnapshot(
        query(
          collection(db, "evaluations"),
          where("companyId", "==", targetCompanyId)
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setEvaluations(items);
        }
      );
      unsubscribes.push(unsubEvals);

      const unsubCandidates = onSnapshot(
        query(
          collection(db, "candidateProfiles"),
          where("companyId", "==", targetCompanyId)
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setCandidateProfiles(items);
        }
      );
      unsubscribes.push(unsubCandidates);

      const unsubHR = onSnapshot(
        query(
          collection(db, "users"),
          where("companyId", "==", targetCompanyId),
          where("companyRole", "==", "hr")
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setHrMembers(items);
        }
      );
      unsubscribes.push(unsubHR);

      const unsubOwner = onSnapshot(
        query(
          collection(db, "users"),
          where("companyId", "==", targetCompanyId),
          where("companyRole", "==", "owner")
        ),
        (snapshot) => {
          if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            setWorkspaceOwner({
              id: docSnap.id,
              ...docSnap.data(),
            });
          } else {
            setWorkspaceOwner(null);
          }
        }
      );
      unsubscribes.push(unsubOwner);

    } else if (user.role === "employee") {
      const unsubEmployees = onSnapshot(
        query(
          collection(db, "employees"),
          where("email", "in", [user.email.toLowerCase(), user.email])
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setEmployees(items);
        }
      );
      unsubscribes.push(unsubEmployees);

      const unsubRequests = onSnapshot(
        query(
          collection(db, "requests"),
          where("requesterUid", "==", user.uid)
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setRequests(items);
        }
      );
      unsubscribes.push(unsubRequests);

      const unsubEvals = onSnapshot(
        query(
          collection(db, "evaluations"),
          where("employeeEmail", "in", [user.email.toLowerCase(), user.email])
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setEvaluations(items);
        }
      );
      unsubscribes.push(unsubEvals);

      const unsubShareLinks = onSnapshot(
        query(
          collection(db, "shareLinks"),
          where("employeeId", "==", user.uid)
        ),
        (snapshot) => {
          const items = [];
          snapshot.forEach((docSnap) => {
            items.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setShareLinks(items);
        }
      );
      unsubscribes.push(unsubShareLinks);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [user]);

  const addEmployee = async (employee) => {
    if (!user) return;
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const newEmployee = {
      companyId: user.companyId || user.uid,
      name: employee.name,
      role: employee.role,
      department: employee.department || "Unassigned",
      status: "Pending",
      date: formattedDate,
      email: employee.email,
      score: 0,
      risk: "Awaiting verification",
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "employees"), newEmployee);
    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "employee",
      title: `${employee.name} was invited to the employee network`,
      time: "Just now",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const verifyEmployee = async (id) => {
    await updateDoc(doc(db, "employees", id), {
      status: "Verified",
      risk: "Low",
    });
  };

  const requestVerification = async (request) => {
    if (!user) return;
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const hrEmailDomain = request.hrEmail.split("@")[1].toLowerCase();
    const newRequest = {
      requesterUid: user.uid,
      requesterEmail: user.email,
      name: user.name,
      company: request.company,
      role: request.role,
      hrEmail: request.hrEmail,
      hrEmailDomain,
      status: "Pending",
      date: formattedDate,
      stage: "Employment check",
      priority: "Normal",
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "requests"), newRequest);
    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "request",
      title: `Requested verification from ${request.company}`,
      time: "Just now",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const submitEvaluation = async (requestId, evaluation) => {
    if (!user) return;
    const targetCompanyId = user.companyId || user.uid;
    const requestDoc = await getDoc(doc(db, "requests", requestId));
    
    if (requestDoc.exists()) {
      const requestData = requestDoc.data();
      let requesterEmail = requestData.requesterEmail;
      
      if (!requesterEmail && requestData.requesterUid) {
        const userDoc = await getDoc(doc(db, "users", requestData.requesterUid));
        if (userDoc.exists()) {
          requesterEmail = userDoc.data().email;
        }
      }
      
      if (!requesterEmail) {
        throw new Error("Verification request does not have a valid requester email associated with it.");
      }

      await addDoc(collection(db, "evaluations"), {
        ...evaluation,
        companyId: targetCompanyId,
        employeeEmail: requesterEmail,
        createdAt: serverTimestamp(),
      });

      const querySnapshot = await getDocs(
        query(
          collection(db, "employees"),
          where("email", "in", [requesterEmail.toLowerCase(), requesterEmail]),
          where("companyId", "==", targetCompanyId),
          where("role", "==", requestData.role)
        )
      );

      const verifierData = {
        verifiedBy: user.name || user.email || "HR Representative",
        verifierEmail: user.email,
        verificationMethod: "Corporate Email Domain Check",
        verifiedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        referenceLetterUrl: evaluation.referenceLetterUrl || "",
        referenceLetterName: evaluation.referenceLetterName || "",
      };

      if (querySnapshot.empty) {
        await addDoc(collection(db, "employees"), {
          companyId: targetCompanyId,
          name: requestData.name,
          role: requestData.role,
          department: "Unassigned",
          status: "Verified",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          email: requesterEmail,
          score: parseFloat(evaluation.overallScore),
          risk: "Low",
          createdAt: serverTimestamp(),
          ...verifierData,
        });
      } else {
        const empDoc = querySnapshot.docs[0];
        await updateDoc(empDoc.ref, {
          status: "Verified",
          score: parseFloat(evaluation.overallScore),
          risk: "Low",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          ...verifierData,
        });
      }
    }

    await updateDoc(doc(db, "requests", requestId), {
      status: "Verified",
      stage: "Complete",
      approvedBy: {
        uid: user.uid,
        name: user.name || "HR Representative",
        email: user.email,
      },
      lastEvaluatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "evaluation",
      title: `${evaluation.employeeName} evaluation submitted with score ${evaluation.overallScore}/10`,
      time: "Just now",
      createdAt: serverTimestamp(),
    });
  };

  const submitAppeal = async (request, reason) => {
    if (!user) return;
    await updateDoc(doc(db, "requests", request.id), {
      status: "Pending",
      stage: "Under Review",
      isAppeal: true,
      appealCount: (request.appealCount || 0) + 1,
      appealReason: reason,
    });
    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "request",
      title: `Submitted an appeal for ${request.company} verification`,
      time: "Just now",
      createdAt: serverTimestamp(),
    });
  };

  const registerCompanyWorkspace = async (name, domain) => {
    if (!user) return;
    const companyRef = await addDoc(collection(db, "companies"), {
      name,
      domain: domain.toLowerCase(),
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "users", user.uid), {
      companyId: companyRef.id,
      companyName: name,
      companyRole: "owner",
    });
    return companyRef.id;
  };

  const provisionHRAccount = async (firstName, lastName, email, password) => {
    if (!user) return;
    const targetCompanyId = user.companyId || user.uid;
    const targetCompanyName = user.companyName || "My Company";
    const secondaryApp = initializeApp(
      firebaseConfig,
      `secondary-hr-${Date.now()}`
    );
    const secondaryAuth = getAuth(secondaryApp);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid = userCredential.user.uid;
      const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
      const fullName = `${firstName} ${lastName}`;
      
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        role: "company",
        companyId: targetCompanyId,
        companyName: targetCompanyName,
        companyRole: "hr",
        firstName,
        lastName,
        name: fullName,
        initials,
        globalId: `u_${uid.substring(0, 8)}`,
        createdAt: serverTimestamp(),
      });
      await signOut(secondaryAuth);
    } finally {
      await deleteApp(secondaryApp);
    }
  };

  const createShareLink = async (share, targetCompanyId = null) => {
    if (!user) return;
    const newShare = {
      employeeId: user.uid,
      recipient: share.recipient,
      access: share.access,
      status: "Active",
      expires: share.expires || "30 days",
      views: 0,
      isDirectShared: !!targetCompanyId,
      targetCompanyId,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "shareLinks"), newShare);
    
    if (targetCompanyId) {
      const verifiedHistory = employees.filter((e) => e.status === "Verified");
      const totalScore = verifiedHistory.reduce((sum, curr) => sum + curr.score, 0);
      const score = verifiedHistory.length > 0
        ? parseFloat((totalScore / verifiedHistory.length).toFixed(1))
        : 0;

      await addDoc(collection(db, "candidateProfiles"), {
        companyId: targetCompanyId,
        name: user.name,
        role: employees.length > 0 ? employees[0].role : "Candidate",
        score: score || 0,
        status: "Access granted",
        expires: share.expires || "30 days",
        flags: "Verified credential record",
        shareLinkId: docRef.id,
        createdAt: serverTimestamp(),
      });
    }

    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "share",
      title: `Profile access granted to ${share.recipient}`,
      time: "Just now",
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
  };

  const deleteShareLink = async (shareId) => {
    if (!user) return;
    const candSnapshot = await getDocs(
      query(
        collection(db, "candidateProfiles"),
        where("shareLinkId", "==", shareId)
      )
    );
    const deletePromises = [];
    candSnapshot.forEach((docSnap) => {
      deletePromises.push(deleteDoc(doc(db, "candidateProfiles", docSnap.id)));
    });
    await Promise.all(deletePromises);
    await deleteDoc(doc(db, "shareLinks", shareId));
    
    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "share",
      title: "Revoked access credentials",
      time: "Just now",
      createdAt: serverTimestamp(),
    });
  };

  const deleteGlobalLink = async (globalId) => {
    if (!user) return;
    await deleteDoc(doc(db, "globalLinks", globalId));
    await updateDoc(doc(db, "users", user.uid), { globalId: null });
    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "share",
      title: "Revoked global profile link",
      time: "Just now",
      createdAt: serverTimestamp(),
    });
  };

  const createGlobalLink = async (access, customId = null) => {
    if (!user) return null;
    let globalId = user.globalId;
    
    if (customId && customId !== user.globalId) {
      const globalDoc = await getDoc(doc(db, "globalLinks", customId));
      if (globalDoc.exists() && globalDoc.data().userId !== user.uid) {
        throw new Error("This link ID is already taken. Please choose another one.");
      }
      globalId = customId;
    }
    
    if (!globalId) {
      globalId = user.linkedInId || `u_${user.uid.substring(0, 8)}`;
    }
    
    if (globalId !== user.globalId) {
      await updateDoc(doc(db, "users", user.uid), { globalId });
    }

    await setDoc(doc(db, "globalLinks", globalId), {
      userId: user.uid,
      access: access || "Full profile",
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "share",
      title: "Global profile link updated",
      time: "Just now",
      createdAt: serverTimestamp(),
    });
    
    return globalId;
  };

  const addManualEmployment = async (record) => {
    if (!user) return;
    const newEmployee = {
      companyId: "manual_entry",
      name: user.name,
      email: user.email.toLowerCase(),
      role: record.role,
      company: record.company,
      department: record.department || "Unassigned",
      status: "Unverified",
      date: record.period,
      score: 0,
      risk: "Unverified",
      summary: record.summary || "",
      tags: ["Self-Declared"],
      createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(db, "employees"), newEmployee);
    await addDoc(collection(db, "activity"), {
      userId: user.uid,
      type: "employee",
      title: `Added manual employment record: ${record.role} at ${record.company}`,
      time: "Just now",
      createdAt: serverTimestamp(),
    });
  };

  const getEmployeeProfile = () => {
    if (!user) return null;
    const verifiedHistory = employees.filter((e) => e.status === "Verified");
    const totalScore = verifiedHistory.reduce((sum, curr) => sum + (curr.score || 0), 0);
    const score = verifiedHistory.length > 0
      ? parseFloat((totalScore / verifiedHistory.length).toFixed(1))
      : 0;
    
    let scoreLabel = "No Score";
    if (score >= 8.5) scoreLabel = "Excellent";
    else if (score >= 7.5) scoreLabel = "Very Good";
    else if (score >= 6) scoreLabel = "Good";
    else if (score > 0) scoreLabel = "Needs Improvement";

    return {
      name: user.name,
      role: user.role === "employee" ? "Professional Profile" : "Company Workspace",
      email: user.email,
      initials: user.initials,
      photoUrl: user.photoUrl,
      score: score || 0,
      scoreLabel,
      verificationConfidence: verifiedHistory.length > 0 ? 90 + verifiedHistory.length * 2 : 0,
      shareStatus: shareLinks.some((s) => s.status === "Active") ? "Shared" : "Private",
    };
  };

  return (
    <DataContext.Provider value={{
      employees,
      addEmployee,
      verifyEmployee,
      requests,
      requestVerification,
      evaluations,
      submitEvaluation,
      submitAppeal,
      addManualEmployment,
      employeeProfile: getEmployeeProfile(),
      employmentHistory: employees.map((emp) => {
        const comp = registeredCompanies.find((c) => c.id === emp.companyId);
        return {
          id: emp.id,
          companyId: emp.companyId,
          role: emp.role,
          company: comp ? comp.name : emp.company || "External Org",
          period: emp.date,
          status: emp.status,
          score: emp.score,
          tags: emp.status === "Verified" ? ["Verified Performance"] : emp.tags || ["Self-Declared"],
          summary: emp.summary || `Employment record for ${emp.role} in ${emp.department || "Unassigned"}.`,
          verifiedBy: emp.verifiedBy || null,
          verifierEmail: emp.verifierEmail || null,
          verificationMethod: emp.verificationMethod || null,
          verifiedAt: emp.verifiedAt || null,
          referenceLetterUrl: emp.referenceLetterUrl || null,
          referenceLetterName: emp.referenceLetterName || null,
        };
      }),
      shareLinks,
      createShareLink,
      createGlobalLink,
      globalId: user?.globalId || null,
      candidateProfiles,
      activity,
      hrMembers,
      workspaceOwner,
      registerCompanyWorkspace,
      provisionHRAccount,
      registeredCompanies,
      deleteShareLink,
      deleteGlobalLink,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
